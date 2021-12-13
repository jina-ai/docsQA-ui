import { css } from 'lit';


export const customScrollbarCSS = css`
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background: transparent;
    }
    ::-webkit-scrollbar-button {
        width: 6px;
        height: 0;
    }
    ::-webkit-scrollbar-track {
        display: none;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #8787874c;
        transition: 0.3s;
        border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background-color: #87878799;
    }
    ::-webkit-scrollbar-thumb:active {
        background-color: #878787;
    }

`;


export default customScrollbarCSS;
