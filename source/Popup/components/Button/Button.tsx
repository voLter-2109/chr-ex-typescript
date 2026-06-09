import type { ButtonHTMLAttributes, FC, ReactNode } from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button: FC<ButtonProps> = ({ children, className, ...props }) => {
  const classNames = [styles.button, className].filter(Boolean).join(" ");

  return (
    <button type="button" className={classNames} {...props}>
      {children}
    </button>
  );
};
