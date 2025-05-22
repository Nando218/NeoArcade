
// Type declarations for JSX elements in a JavaScript-only project

declare namespace JSX {
  interface IntrinsicElements {
    // Add intrinsic elements here
    [elemName: string]: any;
  }
}

// This helps ensure JSX works properly in JavaScript files
declare module "*.jsx" {
  const Component: any;
  export default Component;
}
