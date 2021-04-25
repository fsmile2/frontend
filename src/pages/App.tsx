import "../styles/global.scss"

import {
  BLOCK_TIME,
  STABLECOIN_POOL_NAME,
  ZDAI_DAI_POOL_NAME,
  ZETH_ETH_POOL_NAME,
  ZUSDT_USDT_POOL_NAME,
} from "../constants"
import React, { ReactElement, Suspense, useCallback } from "react"
import { Route, Switch } from "react-router-dom"

import { AppDispatch } from "../state"
import Deposit from "./Deposit"
import Pools from "./Pools"
import Risk from "./Risk"
import Stake from "./Stake"
import Swap from "./Swap"
import ToastsProvider from "../providers/ToastsProvider"
import Web3ReactManager from "../components/Web3ReactManager"
import Withdraw from "./Withdraw"
import fetchGasPrices from "../utils/updateGasPrices"
import fetchTokenPricesUSD from "../utils/updateTokenPrices"
import { useDispatch } from "react-redux"
import usePoller from "../hooks/usePoller"

export default function App(): ReactElement {
  const dispatch = useDispatch<AppDispatch>()
  const fetchAndUpdateTokensPrice = useCallback(() => {
    fetchTokenPricesUSD(dispatch)
  }, [dispatch])
  const fetchAndUpdateGasPrice = useCallback(() => {
    void fetchGasPrices(dispatch)
  }, [dispatch])
  usePoller(fetchAndUpdateGasPrice, BLOCK_TIME)
  usePoller(fetchAndUpdateTokensPrice, BLOCK_TIME * 3)

  return (
    <Suspense fallback={null}>
      <Web3ReactManager>
        <ToastsProvider>
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => (
                <Swap {...props} poolName={STABLECOIN_POOL_NAME} />
              )}
            />
            <Route
              exact
              path="/deposit"
              render={(props) => <Pools action="deposit" {...props} />}
            />
            <Route
              exact
              path="/deposit/eth"
              render={(props) => (
                <Deposit {...props} poolName={ZETH_ETH_POOL_NAME} />
              )}
            />
            <Route
              exact
              path="/deposit/dai"
              render={(props) => (
                <Deposit {...props} poolName={ZDAI_DAI_POOL_NAME} />
              )}
            />
            <Route
              exact
              path="/deposit/usdt"
              render={(props) => (
                <Deposit {...props} poolName={ZUSDT_USDT_POOL_NAME} />
              )}
            />
            <Route
              exact
              path="/deposit/usd"
              render={(props) => (
                <Deposit {...props} poolName={STABLECOIN_POOL_NAME} />
              )}
            />
            <Route
              exact
              path="/withdraw"
              render={(props) => (
                <Withdraw {...props} poolName={STABLECOIN_POOL_NAME} />
              )}
            />
            <Route exact path="/stake" render={() => <Stake />} />
            <Route exact path="/risk" component={Risk} />
          </Switch>
        </ToastsProvider>
      </Web3ReactManager>
    </Suspense>
  )
}
