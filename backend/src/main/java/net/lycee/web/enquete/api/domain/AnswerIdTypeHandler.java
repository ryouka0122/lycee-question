package net.lycee.web.enquete.api.domain;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(AnswerId.class)
@MappedJdbcTypes({JdbcType.OTHER})
public class AnswerIdTypeHandler extends BaseTypeHandler<AnswerId> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, AnswerId parameter, JdbcType jdbcType) throws SQLException {
        ps.setObject(i, parameter.value());
    }

    @Override
    public AnswerId getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        if (value == null) {
            return null;
        }
        return AnswerId.fromString(value);
    }

    @Override
    public AnswerId getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = rs.getString(columnIndex);
        if (value == null) {
            return null;
        }
        return AnswerId.fromString(value);
    }

    @Override
    public AnswerId getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String value = cs.getString(columnIndex);
        if (value == null) {
            return null;
        }
        return AnswerId.fromString(value);
    }
}
