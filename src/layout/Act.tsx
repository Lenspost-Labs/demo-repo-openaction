import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AnyPublication,
  Profile,
  usePublications,
} from "@lens-protocol/react-web";
import { useState } from "react";
import { encodeAbiParameters, encodeFunctionData } from "viem";
import { useWalletClient } from "wagmi";
import { useLensHelloWorld } from "../context/LensHelloWorldContext";
import { publicClient } from "../main";
import { uiConfig } from "../utils/constants";
import { lensHubAbi } from "../utils/lensHubAbi";
import { serializeLink } from "../utils/serializeLink";
import IERC20 from "../abi/IERC20.json";

const ActionBox = ({
  post,
  address,
  profileId,
  refresh,
}: {
  post: AnyPublication;
  address?: `0x${string}`;
  profileId?: number;
  refresh: () => void;
}) => {
  const [actionText, setActionText] = useState<string>("");
  const [createState, setCreateState] = useState<string | undefined>();
  const [txHash, setTxHash] = useState<string | undefined>();
  const { data: walletClient } = useWalletClient();

  const executeCollect = async (post: AnyPublication) => {

     await walletClient?.writeContract({
      address: actionText as `0x${string}`,
      account: walletClient?.account.address,
      abi: IERC20,
      functionName: "increaseAllowance",
      args: [import.meta.env.VITE_OPEN_ACTION_CONTRACT_ADDRESS, 1000000000]
    })

    const encodedCollectActionData = encodeAbiParameters(
      [{ type: "address" }],
      [actionText as `0x${string}`]
    );

    const args = {
      publicationActedProfileId: BigInt(post.by.id || 0),
      publicationActedId: BigInt(post.id.split("-")[1]),
      actorProfileId: BigInt(profileId || 0),
      referrerProfileIds: [],
      referrerPubIds: [],
      actionModuleAddress: uiConfig.openActionContractAddress,
      actionModuleData: encodedCollectActionData as `0x${string}`,
    };

    const calldata = encodeFunctionData({
      abi: lensHubAbi,
      functionName: "act",
      args: [args],
    });

    setCreateState("PENDING IN WALLET");
    try {
      const hash = await walletClient!.sendTransaction({
        to: uiConfig.lensHubProxyAddress,
        account: address,
        data: calldata as `0x${string}`,
      });
      setCreateState("PENDING IN MEMPOOL");
      setTxHash(hash);
      const result = await publicClient({
        chainId: 80001,
      }).waitForTransactionReceipt({ hash });
      if (result.status === "success") {
        setCreateState("SUCCESS");
        refresh();
      } else {
        setCreateState("CREATE TXN REVERTED");
      }
    } catch (e) {
      setCreateState(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="flex flex-col border rounded-xl px-5 py-3 mb-3 justify-center">
      <div className="flex flex-col justify-center items-center">
        <p>ProfileID: {post.by.id}</p>
        <p>PublicationID: {post.id}</p>
        <p>
          Link to{" "}
          <a href={serializeLink((post as unknown as Profile)?.metadata?.rawURI || "")}>
            metadata
          </a>
        </p>
        <Button asChild variant="link">
          <a
            href={`${uiConfig.blockExplorerLink}${post.txHash}`}
            target="_blank"
          >
            Txn Link
          </a>
        </Button>
      </div>
      <div>
        <p className="mb-3">Currency</p>
        <Input
          id={`initializeTextId-${post.id}`}
          type="text"
          value={actionText}
          onChange={(e) => setActionText(e.target.value)}
          disabled={!profileId}
        />
      </div>
      {profileId && (
        <Button className="mt-3" onClick={() => executeCollect(post)}>
          Collect Post
        </Button>
      )}
      {createState && (
        <p className="mt-2 text-primary create-state-text">{createState}</p>
      )}
      {txHash && (
        <a
          href={`${uiConfig.blockExplorerLink}${txHash}`}
          target="_blank"
          className="block-explorer-link"
        >
          Block Explorer Link
        </a>
      )}
    </div>
  );
};

export const Actions = () => {
  const { address, profileId, refresh, loading } = useLensHelloWorld();
  console.log(address);
  console.log(uiConfig.openActionContractAddress);
  // const profileIdString = profileId ? "0x" + profileId.toString(16) : "0x0";
  let { data } = usePublications({
    where: {
      //from: [profileIdString as ProfileId],
      withOpenActions: [{ address: uiConfig.openActionContractAddress }],
    },
  });
  data = data ? data : [];
  console.log(data);
  return (
    <>
      {loading && <div className="spinner" />}
      {data.length === 0 ? (
        <p>None</p>
      ) : (
        data.map((post, index) => (
          <ActionBox
            key={index}
            post={post}
            address={address}
            profileId={profileId}
            refresh={refresh}
          />
        ))
      )}
    </>
  );
};
