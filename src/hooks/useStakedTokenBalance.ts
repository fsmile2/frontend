import { BLOCK_TIME, STABLECOIN_POOL_ID } from "../constants"
import { BigNumber } from "@ethersproject/bignumber"
import { Zero } from "@ethersproject/constants"
import { useActiveWeb3React } from "../hooks"
import { useMasterChefContract } from "./useContract"
import usePoller from "./usePoller"
import { useState } from "react"

export function useStakedTokenBalance(): BigNumber {
  const { account, chainId } = useActiveWeb3React()
  const [balance, setBalance] = useState<BigNumber>(Zero)

  const masterChefContract = useMasterChefContract()

  usePoller((): void => {
    async function pollBalance(): Promise<void> {
      const userInfo = account
        ? await masterChefContract?.userInfo(STABLECOIN_POOL_ID, account)
        : { amount: Zero }

      if (userInfo?.amount !== undefined && userInfo?.amount !== balance) {
        setBalance(userInfo?.amount)
      }
    }

    if (account && chainId) {
      void pollBalance()
    }
  }, BLOCK_TIME * 10)
  return balance
}
