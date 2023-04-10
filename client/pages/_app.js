import "@/styles/globals.css";
import 'toastr/toastr.scss';
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { store, persistor } from "@/redux/Store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";
const queryClient = new QueryClient();
export default function App({ Component, pageProps }) {
  const auth = store.getState().auth;
  const router = useRouter();
  useEffect(() => {
    if (auth.user?.token) {
      axios.defaults.headers.common["Authorization"] = auth.user.token;
    }
    if(!auth.isAuthenticated){
      router.push('/signIn');
    }
  }, [auth.user?.token]);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Layout>
            <QueryClientProvider client={queryClient}>
              <Component {...pageProps} />
            </QueryClientProvider>
          </Layout>
        </PersistGate>
      </Provider>
    </>
  );
}
