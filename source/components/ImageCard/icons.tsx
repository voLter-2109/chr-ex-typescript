import { SVGProps } from "react";

export type IconProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  color?: string;
  title: string;
};

export function CloseIcon({ title, ...props }: IconProps) {
  return (
    <svg
      {...props}
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
        stroke="#b11868"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
        stroke="#b11868"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  );
}

export function DowloadOne({ title, ...props }: IconProps) {
  return (
    <svg
      {...props}
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M12 7L12 14M12 14L15 11M12 14L9 11"
        stroke="#b11868"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16 17H12H8"
        stroke="#b11868"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
        stroke="#b11868"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  );
}

export function DowloadMore({ title, ...props }: IconProps) {
  return (
    <svg
      {...props}
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M8.5 7L8.5 14M8.5 14L11 11M8.5 14L6 11"
        stroke="#b11868"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.5 7L15.5 14M15.5 14L18 11M15.5 14L13 11"
        stroke="#b11868"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M18 17H12H6"
        stroke="#b11868"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
        stroke="#b11868"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  );
}

export function SelectImage({ title, color, ...props }: IconProps) {
  return (
    <svg
      {...props}
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M8.976 21C4.05476 21 3 19.9452 3 15.024"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M21 15.024C21 19.9452 19.9452 21 15.024 21"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M15.024 3C19.9452 3 21 4.05476 21 8.976"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M3 8.976C3 4.05476 4.05476 3 8.976 3"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M12 9.5L12 14.5"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14.5 12L9.5 12"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export function ToggleSelect({ title, ...props }: IconProps) {
  return (
    <svg
      {...props}
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <g
        id="🔍-Product-Icons"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <g
          id="ic_fluent_select_all_24_regular"
          fill="#b11868"
          fill-rule="nonzero"
        >
          <path
            d="M20.4961766,5.62668182 C21.3720675,5.93447702 22,6.76890777 22,7.75 L22,17.75 C22,20.0972102 20.0972102,22 17.75,22 L7.75,22 C6.76890777,22 5.93447702,21.3720675 5.62668182,20.4961766 L7.72396188,20.4995565 L17.75,20.5 C19.2687831,20.5 20.5,19.2687831 20.5,17.75 L20.5,7.75 L20.4960194,7.69901943 L20.4961766,5.62668182 Z M17.246813,2 C18.4894537,2 19.496813,3.00735931 19.496813,4.25 L19.496813,17.246813 C19.496813,18.4894537 18.4894537,19.496813 17.246813,19.496813 L4.25,19.496813 C3.00735931,19.496813 2,18.4894537 2,17.246813 L2,4.25 C2,3.00735931 3.00735931,2 4.25,2 L17.246813,2 Z M17.246813,3.5 L4.25,3.5 C3.83578644,3.5 3.5,3.83578644 3.5,4.25 L3.5,17.246813 C3.5,17.6610266 3.83578644,17.996813 4.25,17.996813 L17.246813,17.996813 C17.6610266,17.996813 17.996813,17.6610266 17.996813,17.246813 L17.996813,4.25 C17.996813,3.83578644 17.6610266,3.5 17.246813,3.5 Z M9.58114564,11.3581942 L13.4696699,7.46966991 C13.7625631,7.1767767 14.2374369,7.1767767 14.5303301,7.46966991 C14.7965966,7.73593648 14.8208027,8.15260016 14.6029482,8.44621165 L14.5303301,8.53033009 L10.0303301,13.0303301 C9.73449239,13.3261678 9.26134027,13.3189471 8.97360394,13.0344464 L8.9,12.95 L7.4,10.95 C7.15147186,10.6186292 7.21862915,10.1485281 7.55,9.9 C7.85124623,9.67406533 8.26714548,9.7090277 8.52699676,9.96621555 L8.6,10.05 L9.58114564,11.3581942 L13.4696699,7.46966991 L9.58114564,11.3581942 Z"
            id="🎨-Color"
          ></path>
        </g>
      </g>
    </svg>
  );
}

export function FilterError({ title, color, ...props }: IconProps) {
  return (
    <svg
      {...props}
      width="800px"
      height="800px"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M7.493 0.015 C 7.442 0.021,7.268 0.039,7.107 0.055 C 5.234 0.242,3.347 1.208,2.071 2.634 C 0.660 4.211,-0.057 6.168,0.009 8.253 C 0.124 11.854,2.599 14.903,6.110 15.771 C 8.169 16.280,10.433 15.917,12.227 14.791 C 14.017 13.666,15.270 11.933,15.771 9.887 C 15.943 9.186,15.983 8.829,15.983 8.000 C 15.983 7.171,15.943 6.814,15.771 6.113 C 14.979 2.878,12.315 0.498,9.000 0.064 C 8.716 0.027,7.683 -0.006,7.493 0.015 M8.853 1.563 C 9.967 1.707,11.010 2.136,11.944 2.834 C 12.273 3.080,12.920 3.727,13.166 4.056 C 13.727 4.807,14.142 5.690,14.330 6.535 C 14.544 7.500,14.544 8.500,14.330 9.465 C 13.916 11.326,12.605 12.978,10.867 13.828 C 10.239 14.135,9.591 14.336,8.880 14.444 C 8.456 14.509,7.544 14.509,7.120 14.444 C 5.172 14.148,3.528 13.085,2.493 11.451 C 2.279 11.114,1.999 10.526,1.859 10.119 C 1.618 9.422,1.514 8.781,1.514 8.000 C 1.514 6.961,1.715 6.075,2.160 5.160 C 2.500 4.462,2.846 3.980,3.413 3.413 C 3.980 2.846,4.462 2.500,5.160 2.160 C 6.313 1.599,7.567 1.397,8.853 1.563 M7.706 4.290 C 7.482 4.363,7.355 4.491,7.293 4.705 C 7.257 4.827,7.253 5.106,7.259 6.816 C 7.267 8.786,7.267 8.787,7.325 8.896 C 7.398 9.033,7.538 9.157,7.671 9.204 C 7.803 9.250,8.197 9.250,8.329 9.204 C 8.462 9.157,8.602 9.033,8.675 8.896 C 8.733 8.787,8.733 8.786,8.741 6.816 C 8.749 4.664,8.749 4.662,8.596 4.481 C 8.472 4.333,8.339 4.284,8.040 4.276 C 7.893 4.272,7.743 4.278,7.706 4.290 M7.786 10.530 C 7.597 10.592,7.410 10.753,7.319 10.932 C 7.249 11.072,7.237 11.325,7.294 11.495 C 7.388 11.780,7.697 12.000,8.000 12.000 C 8.303 12.000,8.612 11.780,8.706 11.495 C 8.763 11.325,8.751 11.072,8.681 10.932 C 8.616 10.804,8.460 10.646,8.333 10.580 C 8.217 10.520,7.904 10.491,7.786 10.530 "
        stroke="none"
        fill-rule="evenodd"
        fill={color}
      ></path>
    </svg>
  );
}
