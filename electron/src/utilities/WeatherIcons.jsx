import React, {useState, useEffect} from "react";

export default function WeatherIcons({weather, className = "", width = "24", height = "24", strokeWidth = "2", strokeColor = "white", fillColor = "none"}) {
    const [path, setPath] = useState(null);

    useEffect(() => {
        switch (weather) {
            case "cloudy":
                setPath(
                    <>
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                    </>
                );
                break;
            case "sunny":
                setPath(
                    <>
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2" />
                        <path d="M12 20v2" />
                        <path d="m4.93 4.93 1.41 1.41" />
                        <path d="m17.66 17.66 1.41 1.41" />
                        <path d="M2 12h2" />
                        <path d="M20 12h2" />
                        <path d="m6.34 17.66-1.41 1.41" />
                        <path d="m19.07 4.93-1.41 1.41" />
                    </>
                );
                break;
            case "rainy":
                setPath(
                    <>
                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                        <path d="M16 14v6" />
                        <path d="M8 14v6" />
                        <path d="M12 16v6" />
                    </>
                );
                break;
            default:
                setPath("M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"); // Default to cloudy if no weather is provided
                break;
        }
    }, [weather]);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth} // You can set this dynamically
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`lucide ${className}`} // Allow additional class names to be passed for styling
        >
            {path}
        </svg>
    );
}
