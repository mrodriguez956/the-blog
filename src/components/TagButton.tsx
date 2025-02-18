// src/components/ButtonComponent.tsx

import { Button} from 'react95';
import { ThemeProvider } from 'styled-components';

import coldGray from 'react95/dist/themes/coldGray';


function ButtonComponent({ tag }: { tag: string }) {
    return (
        <>
        
        <ThemeProvider theme={coldGray}>
      <Button onClick={() => window.location.href = `/tags/${tag}`} size='sm'>
        {tag}
      </Button>
    </ThemeProvider>
        </>
    );
};

export default ButtonComponent;