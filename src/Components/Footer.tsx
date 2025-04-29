const Footer = () => {
  return (
    <footer className="bg-dark p-4">
      <div className="container text-white text-center">
        &copy; {new Date().getFullYear()}. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
