import DateFnsUtils from "@date-io/date-fns";
import format from "date-fns/format";
import ruLocale from "date-fns/locale/ru";

export class RuLocalizedUtils extends DateFnsUtils {
    getCalendarHeaderText(date: Date) {
        return format(date, "LLLL", {locale: this.locale});
    }

    getDatePickerHeaderText(date: Date) {
        return format(date, "dd MMMM", {locale: this.locale});
    }
}

export const localeMap = {
    ru: ruLocale,
};

export const localeUtilsMap = {
    ru: RuLocalizedUtils,
};