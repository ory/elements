/* eslint-disable better-tailwindcss/no-unregistered-classes */

export function MyCustomCardHeader() {
  return (
    <div>
      <style>
        {`
        .my-card-header-h1 {
  font-size: 26px;
  font-weight: bold;
  color: red;
  line-height: 5;
}
`}
      </style>
      <h1 className="my-card-header-h1">My Custom Card header</h1>
    </div>
  )
}
