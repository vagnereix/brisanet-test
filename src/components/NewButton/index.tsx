import { ButtonHTMLAttributes } from 'react';

import styles from './styles.module.scss';

type NewButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function NewButton({ ...props }: NewButtonProps) {
  return <button className={`${styles.newButton}`} {...props} />;
}
