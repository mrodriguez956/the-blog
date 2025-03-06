// src/components/ButtonComponent.tsx
import styles from '../styles/custom98test.module.css';


function DropDownComponent({ tag }: { tag: string }) {
    return (
        <>
           <option> {tag} </option>

        </>
    );
};

export default DropDownComponent;

/*    <ThemeProvider theme={coldGray}>
      <Button onClick={() => window.location.href = `/tags/${tag}`} size='sm'>
        {tag}
      </Button>
    </ThemeProvider>

    */
