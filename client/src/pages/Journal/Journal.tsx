import { useEffect, useState } from "react";
import JournalList from "./JournalList";
import { getRecordsByUserId } from "../../api/records";
import Header from "../../components/Header/Header";

function Journal() {
  const [records, setRecords] = useState();
  useEffect(() => {
    const fetchUserRecords = async () => {
      const records = await getRecordsByUserId();
      setRecords(records);
    };
    fetchUserRecords();
  }, []);
  return (
    <div>
      <Header />
      {records && <JournalList records={records} />}
    </div>
  );
}

export default Journal;
