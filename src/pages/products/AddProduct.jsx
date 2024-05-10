import styled from "styled-components";
import Axios from "../../libs/Axios";
import { faker } from '@faker-js/faker';

const StyledDiv = styled.div`
  height: calc(100vh - 5rem); /* Default height */
  @media (max-width: 640px) {
    height: calc(100vh - 8rem); /* Height when screen size is less than or equal to 640px */
  }
  overflow-y: scroll;
`;

function AddProduct() {

  const handleAddProduct = async () => {
    try {
      const randomNumber = Math.floor(Math.random() * 1000);
      const randomNumber2 = Math.floor(Math.random() * 1000);
      const randomNumber3 = Math.floor(Math.random() * 100);
      for (let i = 1; i < 1000; i++) {
        const payload = {
          'auto_generate_barcode': `${i % 2 === 0 ? true : false}`,
          'prod_name': `prod spam ${faker.string.uuid()}`,
          'prod_cost': randomNumber,
          'prod_barcode': '',
          'prod_sale': randomNumber2,
          'prod_quantity': randomNumber3,
          'cat_id': 1,
          'unit_id': 1
        };

        const response = await Axios.post('/api/product/add-product', payload);
        console.log("Product added successfully:", response.data);
      }
    } catch (err) {
      console.error("Error while adding products: ", err);
    }
  }
  handleAddProduct();
  return (
    <StyledDiv>
      add product
    </StyledDiv>
  )
}

export default AddProduct