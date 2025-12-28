// CertificateDialog.jsx
import { Dialog } from "@material-tailwind/react";
import PropTypes from "prop-types";

const CertificateDialog = ({
  open,
  onClose,
  onButtonClick,
}) => {
  return (
    <Dialog
      open={open}
      handler={onClose}
      size="xs"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
      className="border-2 border-main-dark"
    >
      <div className="2xl:p-[30px] justify-center items-center font-num w-[100%] p-4 lg:p-5 flex flex-col gap-[18px] rounded-xl 2xl:rounded-3xl bg-main-light">
         <img src="/teacher/pdf.png" className="w-[50%]" />
        <div className="w-full flex flex-col items-center justify-center">
          <p className="text-main-dark font-semibold text-2xl">Parabéns</p>
          <p className="text-center">Parabéns! Seu certificado foi gerado com sucesso</p>
        </div>
        <p
          className="bg-main-dark w-[100%] rounded-xl text-center text-white font-bold text-xl mt-2 2xl:text-2xl py-3 cursor-pointer"
          onClick={onButtonClick || onClose}
        >
          Exportar como PDF
        </p>
      </div>
    </Dialog>
  );
};

CertificateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imageSrc: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
};

export default CertificateDialog;
