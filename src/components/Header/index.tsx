import styles from './styles.module.scss'
import {SignInButton} from '../SignInButton'

export function Header(){
  return(
    <header className={styles.headerContainer}>
      <div  className={styles.headerContent}>
        <img src="/images/logo.svg" alt="JDNEWS" />
        <nav>
          <a href="" className={styles.active}>Home</a>
          <a href="">Posts</a>
        </nav>
        <SignInButton></SignInButton>
      </div>
    </header>
    );
}