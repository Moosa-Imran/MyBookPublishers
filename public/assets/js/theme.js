// "use strict";

// // Utility functions
// var hexToRgb = function (hexValue) {
//   var hex = hexValue.startsWith('#') ? hexValue.substring(1) : hexValue;
//   var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
//   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace(shorthandRegex, function (m, r, g, b) {
//     return r + r + g + g + b + b;
//   }));
//   return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
// };

// // Main navbar initialization function
// var navbarInit = function () {
//   var Selector = {
//     NAVBAR: '[data-navbar-on-scroll]',
//     NAVBAR_COLLAPSE: '.navbar-collapse',
//     NAVBAR_TOGGLER: '.navbar-toggler'
//   };
//   var navbar = document.querySelector(Selector.NAVBAR);
//   if (!navbar) return;

//   var color = '#fff'; // Set navbar background color to white
//   var colorRgb = hexToRgb(color);
  
//   var transition = 'background-color 0.35s ease';
//   navbar.style.backgroundColor = 'transparent'; // Initial state

//   // Change navbar background color on scroll
//   window.addEventListener('scroll', function () {
//     var scrollTop = window.scrollY;
//     var alpha = Math.min(scrollTop / 200, 1); // Adjust sensitivity as needed
//     navbar.style.backgroundColor = `rgba(${colorRgb[0]}, ${colorRgb[1]}, ${colorRgb[2]}, ${alpha})`;
//   });
// };

// // Initialize the navbar on document ready
// document.addEventListener('DOMContentLoaded', navbarInit);





