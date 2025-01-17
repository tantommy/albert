import {
  Box,
  Breadcrumb,
  Button,
  Container,
  Layout,
  PlusIcon,
  SlideFade,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from "components"
import { AddAccountModal, useAccountsStore } from "features/accounts"
import { useNetworkContext } from "features/network"
import { TxnList } from "features/transactions"
import { useIsBaseBreakpoint } from "hooks"
import React from "react"

import { AnonymousIdentity } from "@liftedinit/many-js"

import { Assets } from "./assets"

enum TabNames {
  assets = "assets",
  activity = "activity",
}

export function Home() {
  const {
    isOpen: isAddAccountOpen,
    onClose: onCloseAddAccount,
    onOpen: onOpenAddAccount,
  } = useDisclosure()
  const isBase = useIsBaseBreakpoint()
  const [network] = useNetworkContext()
  const account = useAccountsStore(s => s.byId.get(s.activeId))
  const address = account?.address ?? ""
  const [activeTab, setActiveTab] = React.useState<TabNames>(TabNames.assets)
  const isAnonymous = account?.identity instanceof AnonymousIdentity

  function isTabActive(tab: TabNames) {
    return tab === activeTab
  }

  React.useEffect(() => {
    return () => {
      setActiveTab(TabNames.assets)
    }
  }, [account, network])

  return (
    <Layout.Main>
      <SlideFade in>
        <Container maxW={{ base: "auto", md: "container.sm" }}>
          <Breadcrumb my={4}>
            <Breadcrumb.BreadcrumbItem>
              <Breadcrumb.BreadcrumbLink to="/" isCurrentPage={true}>
                Wallet
              </Breadcrumb.BreadcrumbLink>
            </Breadcrumb.BreadcrumbItem>
          </Breadcrumb>
          <Box
            rounded="md"
            shadow="md"
            bgColor="white"
            position="relative"
            p={{ base: 2, md: 4 }}
          >
            <Tabs
              isFitted={isBase ? true : false}
              index={isTabActive(TabNames.assets) ? 0 : 1}
              mb={3}
              onChange={index =>
                setActiveTab(index === 0 ? TabNames.assets : TabNames.activity)
              }
            >
              <TabList>
                <Tab isDisabled={isAnonymous}>{TabNames.assets}</Tab>
                <Tab isDisabled={isAnonymous}>{TabNames.activity}</Tab>
              </TabList>
            </Tabs>

            {isAnonymous ? (
              <>
                <VStack flexDir="column" my={10} spacing={4}>
                  <Text fontWeight="medium">
                    Create or add your account to begin.
                  </Text>

                  <Button
                    onClick={onOpenAddAccount}
                    leftIcon={<PlusIcon />}
                    colorScheme="brand.teal"
                  >
                    Add Account
                  </Button>
                </VStack>
                <AddAccountModal
                  isOpen={isAddAccountOpen}
                  onClose={onCloseAddAccount}
                />
              </>
            ) : (
              <SlideFade in key={activeTab}>
                {isTabActive(TabNames.assets) && <Assets address={address} />}
                {isTabActive(TabNames.activity) && (
                  <TxnList address={address} />
                )}
              </SlideFade>
            )}
          </Box>
        </Container>
      </SlideFade>
    </Layout.Main>
  )
}
