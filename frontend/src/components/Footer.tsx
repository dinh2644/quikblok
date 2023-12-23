const Footer = ({ year }: { year: number }) => {
  return (
    <footer className="bg-light py-3">
      <div className="container text-center">
        <p className="text-muted mb-0">
          &copy; {year} QuikBlok. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
