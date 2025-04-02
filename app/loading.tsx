'use client';

import React, { JSX } from 'react';

export default function Loading(): JSX.Element {
    return (
        <div className="container">
            <div className="content">
                <div className="spinner"></div>
                <p className="text">Loading...</p>
            </div>
        </div>
    );
}
