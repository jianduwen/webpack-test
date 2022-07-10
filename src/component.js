import styles from '@/main.css';
console.log(styles.cborder);
const test = (text = "Hello world.") => {
    const element = document.createElement("div");
    element.className = styles.cborder;
    element.innerHTML = text;
    // console.log(styles);
    return element;
};


const test1 = () => {
    const myarr = ['a', 'b', 'c'];
    if (myarr.includes('a')) {
        console.log('string is included..');
    }
}

export { test, test1 };