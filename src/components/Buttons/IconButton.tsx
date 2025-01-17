import styled from 'styled-components';

const IconButton = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  svg {
      color: #333; 
      width: 16px;
      height: 16px;
  }

  &:hover {
      svg {
          color: #f0f0f0; 
      }
  }
`;


export default IconButton;
