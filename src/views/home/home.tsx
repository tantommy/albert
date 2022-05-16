import React from "react"
import {
  Box,
  Container,
  Heading,
  Layout,
  SlideFade,
  Tab,
  Tabs,
  TabList,
  useAddressText,
} from "components"
import { useIsBaseBreakpoint } from "hooks"
import { useNetworkContext } from "features/network"
import { useAccountsStore } from "features/accounts"
import { Symbols } from "./symbols"
import { AssetDetails } from "./asset-details"
import { Asset } from "features/balances"
import { TxnList } from "features/transactions"

enum TabNames {
  assets = "assets",
  activity = "activity",
}

export function Home() {
  const isBase = useIsBaseBreakpoint()
  const [network] = useNetworkContext()
  const account = useAccountsStore(s => s.byId.get(s.activeId))
  const address = useAddressText(account?.identity!)
  const [asset, setAsset] = React.useState<Asset | undefined>(undefined)
  function onAssetClicked(asset: Asset) {
    setAsset(asset)
  }
  const [activeTab, setActiveTab] = React.useState<TabNames>(TabNames.assets)

  function isTabActive(tab: TabNames) {
    return tab === activeTab
  }

  React.useEffect(() => {
    return () => {
      setActiveTab(TabNames.assets)
      setAsset(undefined)
    }
  }, [account, network])

  return (
    <Layout.Main>
      <SlideFade in>
        <Container maxW={{ base: "full", md: "container.sm" }}>
          <Heading size="lg" mb={3}>
            Wallet
          </Heading>
          <Box
            rounded="md"
            shadow="md"
            bgColor="white"
            position="relative"
            p={{ base: 2, md: 4 }}
          >
            {asset ? (
              <Box>
                <SlideFade in>
                  <AssetDetails
                    asset={asset}
                    setAsset={setAsset}
                    address={address}
                  />
                </SlideFade>
              </Box>
            ) : (
              <SlideFade in>
                <Tabs
                  isFitted={isBase ? true : false}
                  colorScheme="brand.teal"
                  index={isTabActive(TabNames.assets) ? 0 : 1}
                  mb={3}
                  onChange={index =>
                    setActiveTab(
                      index === 0 ? TabNames.assets : TabNames.activity,
                    )
                  }
                >
                  <TabList>
                    <Tab fontWeight="medium">Assets</Tab>
                    <Tab fontWeight="medium">Activity</Tab>
                  </TabList>
                </Tabs>

                {isTabActive(TabNames.assets) && (
                  <SlideFade in>
                    <Symbols
                      onAssetClicked={onAssetClicked}
                      address={address}
                    />
                  </SlideFade>
                )}
                {isTabActive(TabNames.activity) && (
                  <SlideFade in>
                    <TxnList address={address} />
                  </SlideFade>
                )}
              </SlideFade>
            )}
          </Box>
        </Container>
      </SlideFade>
    </Layout.Main>
  )
}
