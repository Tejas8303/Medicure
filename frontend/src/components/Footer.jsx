import { assets } from "../assets/assets";
import Medicure1 from '../assets/Medicure1.png';

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-flow-col gap-14 my-10 mt-40 text-sm">
        <div>
          <img className="mb-5 w-44" src={Medicure1} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6 ">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industrys standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        <div className="mr-20">
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+1-212-34567-82</li>
            <li>Prescripto@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center ">
          Copyright © 2024 <span style={{ color: "red" }}>Tejas</span> - All
          Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
