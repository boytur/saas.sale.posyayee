import styled from "styled-components";
import Product from "./Product";
import Scan from "./Scan";
import Axios from "../../libs/Axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";

const StyledDiv = styled.div`
  height: calc(100vh - 5rem); /* Default height */  
  @media (max-width: 640px) {
    height: calc(100vh - 8rem); /* Height when screen size is less than or equal to 640px */
  }
`;

function Sale() {
  document.title = "ขายของหน้าร้าน 💸 POSYAYEE";

  const { authenticated } = useAuth();

  const [products, setProducts] = useState();

  const fecthAllProducts = async () => {
    try {
      const response = await Axios.get(`/api/product/all-products`);
      if (response.status === 200) {
        setProducts(response.data.products);
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (!authenticated) { return; }
    fecthAllProducts();
  }, [authenticated])

  return (
    <StyledDiv className="w-full flex gap-1">
      <Product products={products} />
      <Scan />
    </StyledDiv>
  );
}

export default Sale;
