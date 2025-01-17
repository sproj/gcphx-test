import { css, DefaultTheme } from 'styled-components'

export const theme: DefaultTheme = {
    buttons: {
        primary: css`
            padding: 6px 12px;
            gap: 0.5rem;

            border-radius: 6px;
            background: #2264E5;

            line-height: 20px;
            color: white;
            font-weight: 500;
            font-size: 14px;

            display: flex;
            align-items: center;

            border: 1px solid #5F7CB0;
            box-shadow: 
                0px 2px 5px 0px #2264E51F,
                0px 0px 0px 1px #2264E5,
                0px 1px 1px 0px #00000024,
                0px 1px 0px 0px #4B85FA inset;
    
            &:hover {
            background: #00359C;
            }
        `,
        secondary: css`
            padding: 6px 12px 6px 12px;
            gap: 0.5rem;

            border-radius: 6px;
            background: #7D90B2;
            
            line-height: 20px;
            color: white;
            font-weight: 500;
            font-size: 14px;

            display: flex;
            align-items: center;

            border: 1px solid #5F7CB0
      `,
      tertiary: css`
        border-radius: 6px;
        gap: 8px;
        padding: 2px 4px;

        background: #FFFFFF;

        box-shadow: 0px 2px 5px 0px #5960781A;

        box-shadow: 0px 0px 0px 1px #464F6029;

        box-shadow: 0px 1px 1px 0px #0000001A;
      `
    },
};