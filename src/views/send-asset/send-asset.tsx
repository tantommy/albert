import { useLocation } from "react-router-dom"
import { Breadcrumb, Box, Container, Layout, SlideFade } from "components"
import { useAccountsStore } from "features/accounts"
import { SendAssetForm } from "features/transactions"

export function SendAsset() {
  const location = useLocation()
  const routeState = location?.state as Record<string, string>
  const account = useAccountsStore(s => s.byId.get(s.activeId))
  const address = account!.address as string

  return (
    <Layout.Main>
      <SlideFade in>
        <Container w={{ base: "full", md: "md" }}>
          <Breadcrumb my={4}>
            <Breadcrumb.BreadcrumbItem>
              <Breadcrumb.BreadcrumbLink to="/send" isCurrentPage={!true}>
                Send
              </Breadcrumb.BreadcrumbLink>
            </Breadcrumb.BreadcrumbItem>
          </Breadcrumb>
          <Box shadow="md" rounded="md" py={8} px={6} bgColor="white">
            <SendAssetForm
              address={address}
              assetAddress={routeState?.assetIdentity}
            />
          </Box>
        </Container>
      </SlideFade>
    </Layout.Main>
  )
}
