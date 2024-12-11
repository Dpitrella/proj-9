import { useState, useEffect } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data } = useData();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    if (data?.events) {
      setFilteredEvents(
        selectedType
          ? data.events.filter((event) => event.type === selectedType)
          : data.events
      );
      setCurrentPage(1); // Reset to first page when changing filter
    }
  }, [data, selectedType]);

  const handleTypeChange = (type) => {
    setSelectedType(type === "Toutes" ? "" : type);
  };

  const typeList = [...new Set(data?.events.map((event) => event.type) || [])];

  const pageCount = Math.ceil(filteredEvents.length / PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  return (
    <>
      <h3 className="SelectTitle">Catégories</h3>
      <Select
        selection={typeList}
        onChange={handleTypeChange}
        name="type"
      />
      <div id="events" className="ListContainer">
        {paginatedEvents.map((event) => (
          <Modal key={event.id} Content={<ModalEvent event={event} />}>
            {({ setIsOpened }) => (
              <EventCard
                onClick={() => setIsOpened(true)}
                imageSrc={event.cover}
                title={event.title}
                date={new Date(event.date)}
                label={event.type}
              />
            )}
          </Modal>
        ))}
      </div>
      <div className="Pagination">
        {[...Array(pageCount)].map((_, index) => (
          <a
            key={`page-${index + 1}`}
            href="#events"
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </a>
        ))}
      </div>
    </>
  );
};

export default EventList;