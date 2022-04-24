import Navigation from '@/components/Navigation.jsx';

const Layout = ({ children }) => (
  <div className='w-full h-full sm:bg-gray-100'>
    <Navigation />

    <div className="container h-screen m-auto p-4 ">{children}</div>
  </div>
);

export default Layout;
