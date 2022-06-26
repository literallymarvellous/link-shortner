import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, FormEvent, useState, Fragment } from "react";
import useClipboard from "react-use-clipboard";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

const options = [
  { value: "secs" },
  { value: "mins" },
  { value: "hrs" },
  { value: "days" },
  { value: "weeks" },
];

const calculateTime = (value: string, time: number) => {
  switch (value) {
    case "secs":
      return time * 1000;
    case "mins":
      return time * 1000 * 60;
    case "hrs":
      return time * 1000 * 60 * 60;
    case "days":
      return time * 1000 * 60 * 60 * 24;
    case "weeks":
      return time * 1000 * 60 * 60 * 24 * 7;
    default:
      return;
  }
};

const Home: NextPage = () => {
  const [url, setUrl] = useState("");
  const [time, setTime] = useState("");
  const [timeOption, setTimeOption] = useState(options[2]);
  const [shortLink, setShortLink] = useState("");
  const [isCopied, setIsCopied] = useClipboard(shortLink, {
    successDuration: 2000,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let expirationTime = calculateTime(timeOption.value, parseInt(time, 10));
    console.log(expirationTime);

    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, expirationTime }),
    });
    const data = await res.json();
    if (data) {
      const host =
        process.env.NODE_ENV === "production"
          ? "lshort.vercel.app/api/"
          : "localhost:3000/api/";
      setShortLink(host + data.slug);
      setUrl("");
      setTime("");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.name === "url" ? setUrl(e.target.value) : setTime(e.target.value);
  };

  return (
    <div className="w-full max-w-5xl m-auto grid h-screen">
      <Head>
        <title>Lshort</title>
        <meta name="description" content="A short link generator" />
      </Head>

      <div className="w-4/5 m-auto max-w-xl">
        <h1 className="text-4xl mb-6 text-center">LShort</h1>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="url">Full Url</label>
          <input
            className="relative cursor-default border rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
            type="text"
            name="url"
            value={url}
            required
            placeholder="https://example.com"
            pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$"
            onChange={handleChange}
          />

          <label htmlFor="time" className="mt-4">
            Expiration time
          </label>

          <div className="flex justify-between">
            <input
              className="relative w-5/6 border cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
              type="text"
              name="time"
              value={time}
              required
              min={1}
              onChange={handleChange}
              pattern="[0-9]*"
            />
            <Listbox value={timeOption} onChange={setTimeOption}>
              <div className="relative mt-1">
                <Listbox.Button className="relative cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{timeOption.value}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <SelectorIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 z-20 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {options.map((option, optionIdx) => (
                      <Listbox.Option
                        key={optionIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={option}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {option.value}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <CheckIcon
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          <button className="mt-4 border border-gray-400 rounded-lg p-2 bg-blue-400 text-white text-lg relative cursor-default shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
            Shrink
          </button>
        </form>

        <div className="flex justify-between mt-4 bg-slate-300 px-2 py-4 rounded-lg t">
          <div className="w-11/12">
            Shortened Link:{" "}
            {shortLink && (
              <a href={shortLink} target="_blank" rel="noreferrer">
                {shortLink}
              </a>
            )}
          </div>
          <div
            style={{ width: 25, height: 25 }}
            role="button"
            onClick={setIsCopied}
            className="relative cursor-pointer"
          >
            {isCopied && (
              <p className="absolute -top-1 left-7 z-10 p-2 rounded-md bg-black text-white text-sm">
                copied!
              </p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
