// src/components/ButtonComponent.tsx
import styles from '../styles/custom98test.module.css';


function ButtonComponent({ tag }: { tag: string }) {
    return (
        <>
      <button className="hidden lg:flex" onClick={() => window.location.href = `/the-blog/tags/${tag}`}>{tag}</button>


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
