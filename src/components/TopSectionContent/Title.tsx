import { useLocation } from "react-router"
import { ValidRoutePath } from "../../routes"
import styled from "styled-components"
import { useMemo } from "react"

const StyledTitle = styled.span`
    font-size: 24px;
    font-weight: 500;
    line-height: 29.05px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: #2E3B52;

`

export const Title: React.FC<{}> = () => {
    const { pathname } = useLocation()
    const title = useMemo(() => pathToTitle(pathname as ValidRoutePath), [pathname])

    return (
        <StyledTitle>{title}</StyledTitle>
    )
}

const pathToTitle = (path: ValidRoutePath) => {
    switch (path) {
        case '/': {
            return 'All cases'
        }
        default: {
            return `${path.charAt(1).toLocaleUpperCase() + path.slice(2)} cases`
        }
    }
}