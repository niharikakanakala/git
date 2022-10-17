import { render, waitFor, queryByAttribute, act } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import testData from './src/components/data';
import mockAxios from 'axios';
import CycloneData from './src/components/CycloneData';
import axios from 'axios';

function delay(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

describe('App', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Require Webpage Call', async () => {
    let dom;
    act(() => {
      dom = render(<CycloneData />);
    });

    const getSpy = jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: testData.toString(),
    });
    expect(getSpy).toBeCalledWith(
      'https://en.wikipedia.org/wiki/2021_North_Indian_Ocean_cyclone_season'
    );

    await delay(1000);
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });
  });

  test('should download CSV', async () => {
    let dom;
    const getById = queryByAttribute.bind(null, 'id');

    act(() => {
      dom = render(<CycloneData />);
    });

    await delay(1000);

    const mLink = {
      href: '',
      click: jest.fn(),
      download: '',
      style: { display: '' },
      setAttribute: jest.fn(),
    };

    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValueOnce(mLink);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();

    const downloadBtn = getById(dom.container, 'download-btn-xls');
    act(() => {
      userEvent.click(downloadBtn);
    });
    await delay(1000);
    expect(createElementSpy).toBeCalledWith('a');
    expect(mLink.setAttribute.mock.calls.length).toBe(1);
    expect(mLink.setAttribute.mock.calls).toEqual([
      ['download', 'cyclone_data.csv'],
    ]);
    expect(mLink.click).toBeCalled();
  });

  test('should download JSON', async () => {
    document.getElementsByTagName('html')[0].innerHTML = '';
    await delay(1000);

    let dom;
    const getById = queryByAttribute.bind(null, 'id');
    act(() => {
      dom = render(<CycloneData />);
    });
    await delay(1000);
    const mLink = {
      href: '',
      click: jest.fn(),
      download: '',
      style: { display: '' },
      setAttribute: jest.fn(),
    };
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValueOnce(mLink);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    const downloadBtn = getById(dom.container, 'download-btn');
    act(() => {
      userEvent.click(downloadBtn);
    });
    await delay(1000);
    expect(createElementSpy).toBeCalledWith('a');
    expect(mLink.setAttribute.mock.calls.length).toBe(1);
    expect(mLink.setAttribute.mock.calls).toEqual([
      ['download', 'cyclone_data.json'],
    ]);
  });
});

describe('Data Scrapping', () => {
  test('Data Scrappring', async () => {
    document.getElementsByTagName('html')[0].innerHTML = '';
    await delay(1000);
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: testData.toString(),
      })
    );

    let dom;
    const getById = queryByAttribute.bind(null, 'id');

    act(() => {
      dom = render(<CycloneData />);
    });

    const getSpy = jest.spyOn(axios, 'get').mockResolvedValueOnce();
    expect(getSpy).toBeCalledWith(
      'https://en.wikipedia.org/wiki/2021_North_Indian_Ocean_cyclone_season'
    );

    await delay(1000);
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    const name = getById(dom.container, '0');

    await delay(1000);
    await waitFor(() => {
      expect(name.innerHTML).toBe('D');
    });
  });
});
