import { Route, Routes } from 'react-router'
import Layout from './Layout'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<>Your app here.</>} />
        <Route path='pending' element={<>Your app here.</>} />
        <Route path='accepted' element={<>Your app here.</>} />
        <Route path='rejected' element={<>Your app here.</>} />
      </Routes>
    </Layout>
  )
}

export default App
