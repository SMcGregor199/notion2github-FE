import {Layout} from "antd";
import {SiteHeader} from "./components/Header";



function App() {
  return (
    <Layout>
      <SiteHeader/>
      <Layout.Content
        id="main"
        style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}
      >
       <h1>Main Content Area</h1> 
      </Layout.Content>
    </Layout>
  );
}

export default App
