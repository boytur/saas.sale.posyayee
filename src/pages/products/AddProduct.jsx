import styled from "styled-components";



const StyledDiv = styled.div`
  height: calc(100vh - 5rem); /* Default height */
  @media (max-width: 640px) {
    height: calc(100vh - 8rem); /* Height when screen size is less than or equal to 640px */
  }
  overflow-y: scroll;
`;

function AddProduct() {
    return (
        <StyledDiv>
            add product
        </StyledDiv>
    )
}

export default AddProduct