import { UserProvider } from "@/FunComponents/Context/UserContext"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
  <>
    <UserProvider>
      {children}
    </UserProvider>
  </>
          
  )
}