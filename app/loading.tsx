'use client';

import React, { JSX } from 'react';

export default function Loading(): JSX.Element {
    return (
        <div className="container-loading">
            <div className="content-loading">
                <div className="spinner"></div>
                <p className="text">Loading...</p>
            </div>
        </div>
    );
}
