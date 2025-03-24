'use client';

import React, { JSX } from 'react';
import styles from './loading.module.scss';

export default function Loading(): JSX.Element {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.spinner}></div>
                <p className={styles.text}>Loading...</p>
            </div>
        </div>
    );
}
