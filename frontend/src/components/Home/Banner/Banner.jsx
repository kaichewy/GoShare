import girlHeadphones from "@/assets/images/girl_headphones.png";
import { Link } from 'react-router-dom';
import "./Banner.css";

const Banner = () => {
  return (
    <div className="sub-container">
      <div className="banner">
        <div className="banner-text">
          <h1>
            Grab upto 50% off on <br></br>selected Headphones
          </h1>
          <span className="is-buy-now">
            <Link to="/product">
              <button className="btn-rounded buy-now">Buy Now</button>
            </Link>
          </span>
        </div>
        <div className="subject">
          <img src={girlHeadphones} alt="Girl Headphones" width={"100%"} />
        </div>
      </div>
    </div>
  );
};
export default Banner;
