import LoginForm from './LoginForm'

export default function LoginPage({
  searchParams
}: {
  searchParams: { token?: string; error?: string }
}) {
  return <LoginForm token={searchParams.token} error={searchParams.error} />
}
