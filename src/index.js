// /*jshint ignore:start */
import React from 'react';
import ReactDOM from 'react-dom';
// import uuidv1 from 'uuid';


// const officeProjects = [
//   'referralBannerOffice',
//   'referralBannerOfficeSupport',
//   'referralBannerTeloSupport',
//   'referralBannerTelo',
//   'referral',
//   'leavingSoonPromo',
//   'officeHomeBanner',

// ];


// const List = (props) => {
//   return (
//     <React.Fragment>
//       <h1 class="h2">Project List</h1>

//       {/* <ul>

//         {
//           officeProjects.map((val) => {
//             return <li key={uuidv1()}><a href={val}>{val}</a></li>
//           })
//         }

//       </ul> */}
//     </React.Fragment>

//   )

// }






// document.querySelectorAll('#root')
//     .forEach(domContainer => {
//         ReactDOM.render(
//             <List />,
//             domContainer
//         );
//     })







// // if (module.hot) {
// // Whenever a new version of App.js is available
// //   module.hot.accept('@/components/Phone', function () {
// //     // Require the new version and render it instead
// //     var NextApp = require('@/components/Phone')
// //     document.querySelectorAll('.js-cj-phone')
// //     .forEach(domContainer =>{
// //         ReactDOM.render(
// //           <Phone phone={data.phone} />,
// //           domContainer
// //         );
// //     })
// //   })
// // }





import { test, test1 } from "@/component";
// test1();
let demoComponent = test();

document.body.appendChild(demoComponent);




if (module.hot) {
    // Capture hot update
    module.hot.accept("@/component", () => {
        const nextComponent = test();

        // Replace old content with the hot loaded one
        document.body.replaceChild(nextComponent, demoComponent);

        demoComponent = nextComponent;
    });
}