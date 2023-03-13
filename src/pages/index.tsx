import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'socket.io-client';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface IMsg {
  user: string;
  msg: string;
}

const navigation = [{ name: 'Dashboard', href: '/', current: true }];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState('');
  const [chat, setChat] = useState<IMsg[]>([]);
  const [msg, setMsg] = useState<string>('');
  const socket: any = useRef(null);
  const inputRef: any = useRef(null);

  const sendMessage = async () => {
    if (msg && connected) {
      const message: IMsg = {
        user,
        msg,
      };

      try {
        const res = await fetch('/api/conversation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });

        console.log(res);

        if (res.status === 200) {
          setMsg('');
        }
      } catch (error) {
        console.log(error);
      }
    }

    inputRef.current.focus();
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    const socketInitializer = async () => {
      try {
        socket.current = connect('http://localhost:3000', {
          path: '/api/socketio',
        });

        socket.current.on('connect', () => {
          console.log('SOCKET CONNECTED!', socket.current.id);
          const userName = prompt('Enter your name:');
          const user = userName ? userName : 'User_' + socket.current.id;
          setUser(user);
          setConnected(true);
        });

        socket.current.on('message', (msg: IMsg) => {
          console.log(msg);

          setChat((prev) => [...prev, msg]);
        });
      } catch (error) {
        console.log(error);
      }
    };
    socketInitializer();
    inputRef.current.focus();

    if (socket.current) return () => socket.current.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>Bunny Chat</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className=" min-h-screen flex flex-col">
        <Disclosure as="nav" className="bg-gray-800 sticky top-0">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-8 w-8"
                        src="/favicon.ico"
                        alt="Your Company"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            <Image
                              className="h-8 w-8 rounded-full"
                              src={'https://i.pravatar.cc/300'}
                              alt="profile image"
                              width={32}
                              height={32}
                            />
                          </Menu.Button>
                        </div>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-700 pt-4 pb-3">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-10 w-10 rounded-full"
                        src={'https://i.pravatar.cc/300'}
                        alt="profile image"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {user}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <main className="flex flex-1">
          <div className="sm:mx-auto mx-1 max-w-7xl py-6 sm:px-6 lg:px-8 flex flex-col justify-between flex-1">
            <div className="flex flex-col gap-1">
              {chat.length ? (
                chat.map((chat, index) => (
                  <div key={index} className="flex gap-3">
                    <div
                      className={`${
                        chat.user === user ? 'text-gray-800' : 'text-green-600'
                      } text-sm w-20 text-ellipsis overflow-hidden`}
                      data-te-toggle="tooltip"
                      data-te-placement="top"
                      data-te-ripple-init
                      data-te-ripple-color="light"
                      title={chat.user === user ? 'Me' : chat.user}
                    >
                      {chat.user === user ? 'Me' : chat.user}
                    </div>
                    :<pre className="text-sm flex-1">{chat.msg}</pre>
                  </div>
                ))
              ) : (
                <div>No Chat</div>
              )}
            </div>
            <div className="flex items-center justify-between gap-1 fixed bottom-0 left-0 right-0 bg-white p-5">
              <textarea
                ref={inputRef}
                name="message"
                onChange={(e) => setMsg(e.target.value)}
                className="flex-1 p-2 rounded outline-none bg-slate-200"
                placeholder="Enter Here!"
                onKeyDown={handleKeyDown}
                value={msg}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:bg-blue-300"
                onClick={sendMessage}
                disabled={!connected}
              >
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
