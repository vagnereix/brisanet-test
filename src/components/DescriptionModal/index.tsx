import { GoogleMap, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { useCallback, useRef, useState } from 'react';
import Modal from 'react-modal';
import styles from './styles.module.scss';

import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Close } from '../../assets/icons/js/close';
import { Comic } from '../../hooks/useSearch';

interface DescriptionModalProps {
  isOpen: boolean;
  comic: Comic | undefined;
  onRequestClose: () => void;
}

export function DescriptionModal({
  isOpen,
  comic,
  onRequestClose,
}: DescriptionModalProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
  const [formattedAddress, setFormattedAddress] = useState<string>('');
  const [position, setPosition] = useState({
    lat: 40.7128,
    lng: -73.9872,
  });
  const geocoder = new google.maps.Geocoder();

  function getAdressByLatLng(latLng: google.maps.LatLng) {
    geocoder.geocode({ location: latLng }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        setFormattedAddress(results![0].formatted_address);
        formRef.current?.reset();
      } else {
        return toast.error(`We can't find this address or coordinates.`, {
          position: 'top-right',
        });
      }
    });
  }

  function onMapLoad(map: google.maps.Map) {
    setMap(map);

    map.addListener('click', function (event: google.maps.MapMouseEvent) {
      if (event.latLng) {
        setPosition(event.latLng?.toJSON());
        getAdressByLatLng(event.latLng);
      }
    });
  }

  function onLoad(ref: google.maps.places.SearchBox) {
    setSearchBox(ref);
  }

  function onPlacesChanged() {
    const places = searchBox!.getPlaces();
    const place = places![0];
    const location = {
      lat: place?.geometry?.location?.lat() || 0,
      lng: place?.geometry?.location?.lng() || 0,
    };

    setFormattedAddress(place?.formatted_address || '');
    setPosition(location);
    map?.panTo(location);
  }

  function sendComic() {
    if (formattedAddress.trim().length) {
      onRequestClose();
      return toast.success(
        `🚚 Comic ${comic?.title} will be sended to ${formattedAddress}.`,
        {
          position: 'top-right',
        }
      );
    }

    return toast.warning(`🚚 Please type some adress to send this comic?.`, {
      position: 'top-right',
    });
  }

  const onUnmount = useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName='react-modal-overlay'
      className='react-modal-content'
    >
      <button
        type='button'
        onClick={onRequestClose}
        className='react-modal-close'
      >
        <Close />
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Author(s)</th>
            <th>On sale date</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          <tr key={comic?.id}>
            <td>
              <img
                src={`${comic?.thumbnail.path}.${comic?.thumbnail.extension}`}
                alt=''
              />
            </td>
            <td>{comic?.title.toLowerCase()}</td>
            <td>
              {comic?.creators &&
                comic?.creators.map((creator) => {
                  return (
                    <>
                      <span key={creator.name}>
                        {creator.name.toLocaleLowerCase()}
                      </span>
                      <br />
                    </>
                  );
                })}
            </td>
            <td>
              {comic?.dates &&
                comic?.dates.map((date) => {
                  return (
                    <>
                      <span key={date.date}>
                        {date.type === 'onsaleDate' &&
                          dayjs(date.date).format('DD/MM/YYYY')}
                      </span>
                    </>
                  );
                })}
            </td>
            <td>
              {comic?.prices.map((price) => {
                return (
                  <>
                    <span key={price.price}>
                      {price.type === 'printPrice' &&
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(Number(price.price))}
                    </span>
                  </>
                );
              })}
            </td>
          </tr>
        </tbody>
      </table>

      <section className={styles.maps}>
        <GoogleMap
          onLoad={onMapLoad}
          mapContainerClassName={styles.mapsContainer}
          center={position}
          zoom={15}
          onUnmount={onUnmount}
          options={{ disableDefaultUI: true }}
        >
          <Marker position={position} />
          <StandaloneSearchBox
            onLoad={onLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <form ref={formRef}>
              <input
                type='text'
                placeholder='Type some adress to send this comic'
              />
              <button type='button' onClick={sendComic}>
                Send
              </button>
            </form>
          </StandaloneSearchBox>
        </GoogleMap>
      </section>
    </Modal>
  );
}
