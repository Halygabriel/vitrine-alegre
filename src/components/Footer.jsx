import Brand from './Brand.jsx';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <Brand compact />
          <p>Academic project · Ifes Campus de Alegre · TADS</p>
        </div>
        <div className="site-footer__meta">
          <p>Data: dummyjson.com</p>
          <p>Images and products are fictional</p>
        </div>
      </div>
    </footer>
  );
}
