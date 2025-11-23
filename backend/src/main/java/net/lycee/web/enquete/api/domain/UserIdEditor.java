package net.lycee.web.enquete.api.domain;

import java.beans.PropertyEditorSupport;

public class UserIdEditor extends PropertyEditorSupport {
    @Override
    public String getAsText() {
        Object o = getValue();
        if (o == null) {
            return null;
        }
        return ((UserId) o).value().toString();
    }

    @Override
    public void setAsText(String text) throws IllegalArgumentException {
        setValue(UserId.fromString(text));
    }
}
