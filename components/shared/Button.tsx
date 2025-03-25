import React from 'react'
import {
    Button as CarbonButton,
    InlineLoading
} from '@carbon/react';

interface ButtonProps {
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string;
    isSubmitting?: boolean;
    loadingText?: string;
    children: React.ReactNode;
    size: "sm" | "md" | "lg" | "xl" | "2xl";
    onClick?: () => void;
}

const CustomButton = (props: ButtonProps) => {
    const {
        type = "button",
        disabled = false,
        className = "",
        isSubmitting = false,
        loadingText = "Loading...",
        children,
        size = "sm",
        onClick
    } = props;

    return (
        <CarbonButton
            size={size}
            type={type}
            disabled={disabled || isSubmitting}
            className={className}

            onClick={onClick}
        >
            {isSubmitting ? (
                <>
                    <InlineLoading description={loadingText} />
                </>
            ) : (
                children
            )}
        </CarbonButton>
    );
}

export default CustomButton;