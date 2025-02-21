// src/components/ButtonComponent.tsx
import styles from '../styles/custom98.module.css';
// import { Button} from 'react95';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import coldGray from 'react95/dist/themes/coldGray';



function ButtonComponent({ tag }: { tag: string }) {
    return (
        <>
      <button onClick={() => window.location.href = `/tags/${tag}`}>{tag}</button>


        </>
    );
};

export default ButtonComponent;

/*    <ThemeProvider theme={coldGray}>
      <Button onClick={() => window.location.href = `/tags/${tag}`} size='sm'>
        {tag}
      </Button>
    </ThemeProvider>

    */
