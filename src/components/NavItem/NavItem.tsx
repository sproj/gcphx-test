import styled from "styled-components";
import { RouteDescriptor } from "../../routes";
import { NavLink } from "react-router";

export interface NavItemProps extends RouteDescriptor {
}

const StyledNavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 0px 8px 8px 0px;
  opacity: 0px;
  color: #2E3B52;
  line-height: 16.4px;


  &.active {
    background: #0A65FF;
    color: #ffffff;
  }

  &:not(.active):hover {
    background-color: #dae1ec;
  }
`

export const NavItem: React.FC<NavItemProps> = ({ path, name, icon: Icon }) => {
    return (
        <StyledNavItem to={path}>
            <Icon size={24} />
            {name}
        </StyledNavItem>
    )
}