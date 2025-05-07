import { useEffect, useState } from "react";

import {
  CompanyHolidayCalendar,
  CreateCompanyHolidayCalendarInput,
  DeleteCompanyHolidayCalendarInput,
  UpdateCompanyHolidayCalendarInput,
} from "../../API";
import createCompanyHolidayCalendarsData from "./createCompanyHolidayCalendarsData";
import deleteCompanyHolidayCalendarData from "./deleteCompanyHolidayCalendarData";
import fetchCompanyHolidayCalendars from "./fetchCompanyHolidayCalendars";
import updateCompanyHolidayCalendarData from "./updateCompanyHolidayCalendarData";

export default function useCompanyHolidayCalendars() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [companyHolidayCalendars, setCompanyHolidayCalendars] = useState<
    CompanyHolidayCalendar[]
  >([]);

  const createCompanyHolidayCalendar = async (
    input: CreateCompanyHolidayCalendarInput
  ) =>
    createCompanyHolidayCalendarsData(input)
      .then((res) => {
        setCompanyHolidayCalendars((prev) => [...prev, res]);
        return res;
      })
      .catch((e) => {
        throw e;
      });

  const updateCompanyHolidayCalendar = async (
    input: UpdateCompanyHolidayCalendarInput
  ) =>
    updateCompanyHolidayCalendarData(input)
      .then((res) => {
        setCompanyHolidayCalendars((prev) =>
          prev.map((companyHolidayCalendar) =>
            companyHolidayCalendar.id === res.id ? res : companyHolidayCalendar
          )
        );
        return res;
      })
      .catch((e) => {
        throw e;
      });

  const deleteCompanyHolidayCalendar = async (
    input: DeleteCompanyHolidayCalendarInput
  ) =>
    deleteCompanyHolidayCalendarData(input)
      .then((res) => {
        setCompanyHolidayCalendars((prev) =>
          prev.filter(
            (companyHolidayCalendar) => companyHolidayCalendar.id !== res.id
          )
        );
        return res;
      })
      .catch((e) => {
        throw e;
      });

  const bulkCreateCompanyHolidayCalendar = async (
    inputs: CreateCompanyHolidayCalendarInput[]
  ) =>
    Promise.all(inputs.map((input) => createCompanyHolidayCalendarsData(input)))
      .then((res) => {
        setCompanyHolidayCalendars((prev) => [...prev, ...res]);
        return res;
      })
      .catch((e) => {
        throw e;
      });

  const fetchAllCompanyHolidayCalendars = async () => {
    setLoading(true);
    setError(null);
    try {
      const calendars = await fetchCompanyHolidayCalendars();
      setCompanyHolidayCalendars(calendars);
      return calendars;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    companyHolidayCalendars,
    createCompanyHolidayCalendar,
    updateCompanyHolidayCalendar,
    deleteCompanyHolidayCalendar,
    bulkCreateCompanyHolidayCalendar,
    fetchAllCompanyHolidayCalendars,
  };
}
